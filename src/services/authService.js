import { supabase } from "../lib/supabase";

const getErrorMessage = (error) => error?.message || "An unexpected authentication error occurred.";

async function upsertCustomerProfile(user, updates = {}) {
	const profile = {
		user_id: user.id,
		email: user.email,
		...updates,
	};

	const { data, error } = await supabase
		.from("profiles")
		.upsert(profile, { onConflict: "user_id" })
		.select()
		.single();

	return { profile: data || null, error };
}

export async function signUpCustomer(email, password, fullName = "", phone = "") {
	try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName, phone } },
		});
		if (error) return { user: null, error: getErrorMessage(error) };
		if (!data.user) return { user: null, error: "Customer registration did not return a user." };
		if (!data.session) return { user: data.user, requiresEmailConfirmation: true, error: null };

		const { error: profileError } = await upsertCustomerProfile(data.user, { full_name: fullName, phone, role: "customer" });
		if (profileError) return { user: data.user, error: getErrorMessage(profileError) };

		return { user: data.user, requiresEmailConfirmation: false, error: null };
	} catch (error) {
		return { user: null, error: getErrorMessage(error) };
	}
}

export async function signInCustomer(email, password) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) return { user: null, error: getErrorMessage(error) };

		if (data.user) {
			const { profile, error: profileError } = await getCustomerProfile(data.user.id);
			if (profileError) return { user: null, error: profileError };

			if (!profile) {
				const { error: upsertError } = await upsertCustomerProfile(data.user, {
					full_name: data.user.user_metadata?.full_name || "",
					phone: data.user.user_metadata?.phone || "",
					role: "customer",
				});
				if (upsertError) return { user: data.user, error: getErrorMessage(upsertError) };
			} else if (profile.role !== "customer") {
				await supabase.auth.signOut();
				return { user: null, error: "This account is not a customer account." };
			}
		}

		return { user: data.user, error: null };
	} catch (error) {
		return { user: null, error: getErrorMessage(error) };
	}
}

export async function signOutCustomer() {
	try {
		const { error } = await supabase.auth.signOut();
		return { error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}

export async function getCurrentCustomer() {
	try {
		const { data, error } = await supabase.auth.getUser();
		return { user: data.user || null, error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { user: null, error: getErrorMessage(error) };
	}
}

export function onAuthStateChange(callback) {
	const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
		callback({ user: session?.user || null, event, session });
	});

	return () => subscription?.unsubscribe();
}

export async function getCustomerProfile(userId) {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error?.code === "PGRST116") return { profile: null, error: null };
		return { profile: data || null, error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { profile: null, error: getErrorMessage(error) };
	}
}

export async function updateCustomerProfile(userId, updates) {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.update(updates)
			.eq("user_id", userId)
			.select()
			.single();

		return { profile: data || null, error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { profile: null, error: getErrorMessage(error) };
	}
}

async function getVendorProfileRecord(userId) {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error?.code === "PGRST116") return { profile: null, error: null };
		return { profile: data || null, error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { profile: null, error: getErrorMessage(error) };
	}
}

async function upsertVendorProfile(userId, profile) {
	const { data, error } = await supabase
		.from("vendor_profiles")
		.upsert({ user_id: userId, ...profile }, { onConflict: "user_id" })
		.select()
		.single();

	return { profile: data || null, error };
}

export async function signUpVendor(email, password, fullName = "", phone = "", vendorProfile = {}) {
	try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
					phone,
					business_name: vendorProfile.businessName || "",
					city: vendorProfile.city || "",
					description: vendorProfile.description || "",
					logo_url: vendorProfile.logoUrl || "",
				},
			},
		});
		if (error) return { user: null, error: getErrorMessage(error) };
		if (!data.user) return { user: null, error: "Vendor registration did not return an authenticated user." };
		if (!data.session) return { user: data.user, requiresEmailConfirmation: true, error: null };

		const { error: profileError } = await supabase.from("profiles").upsert({
			user_id: data.user.id,
			email: data.user.email,
			full_name: fullName,
			phone,
			role: "vendor",
		}, { onConflict: "user_id" });
		if (profileError) return { user: data.user, error: getErrorMessage(profileError) };

		const { error: vendorProfileError } = await upsertVendorProfile(data.user.id, {
			business_name: vendorProfile.businessName || "",
			phone,
			city: vendorProfile.city || "",
			description: vendorProfile.description || "",
			logo_url: vendorProfile.logoUrl || "",
		});
		if (vendorProfileError) return { user: data.user, error: getErrorMessage(vendorProfileError) };

		return { user: data.user, requiresEmailConfirmation: false, error: null };
	} catch (error) {
		return { user: null, error: getErrorMessage(error) };
	}
}

export async function signInVendor(email, password) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) return { user: null, error: getErrorMessage(error) };

		const user = data.user;
		if (!user?.id) return { user: null, error: "Vendor authentication did not return a user." };

		const { profile, error: profileError } = await getVendorProfileRecord(user.id);
		if (profileError) return { user: null, error: profileError };

		if (profile && profile.role === "customer") {
			await supabase.auth.signOut();
			return { user: null, error: "This account is not a vendor account." };
		}

		if (!profile || profile.role !== "vendor") {
			const { error: upsertProfileError } = await supabase.from("profiles").upsert({
				user_id: user.id,
				email: user.email,
				full_name: profile?.full_name || user.user_metadata?.full_name || "",
				phone: profile?.phone || user.user_metadata?.phone || "",
				role: "vendor",
			}, { onConflict: "user_id" });

			if (upsertProfileError) return { user, error: getErrorMessage(upsertProfileError) };
		}

		const { profile: vendorProfile, error: vendorProfileError } = await getVendorProfile(user.id);
		if (vendorProfileError) return { user: null, error: vendorProfileError };

		if (!vendorProfile) {
			const { error: vendorProfileUpsertError } = await upsertVendorProfile(user.id, {
				business_name: user.user_metadata?.business_name || "",
				phone: profile?.phone || user.user_metadata?.phone || "",
				city: user.user_metadata?.city || "",
				description: user.user_metadata?.description || "",
				logo_url: user.user_metadata?.logo_url || "",
			});

			if (vendorProfileUpsertError) return { user, error: getErrorMessage(vendorProfileUpsertError) };
		}

		return { user, error: null };
	} catch (error) {
		return { user: null, error: getErrorMessage(error) };
	}
}

export async function signOutVendor() {
	try {
		const { error } = await supabase.auth.signOut();
		return { error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}

export async function getCurrentVendor() {
	try {
		const { data, error } = await supabase.auth.getUser();
		if (error) return { user: null, profile: null, error: getErrorMessage(error) };

		const user = data.user;
		if (!user) return { user: null, profile: null, error: null };

		const { profile, error: profileError } = await getVendorProfileRecord(user.id);
		if (profileError) return { user: null, profile: null, error: profileError };
		if (!profile || profile.role === "customer" || profile.role !== "vendor") {
			return { user: null, profile: null, error: "This account is not a vendor account." };
		}

		const { profile: vendorProfile, error: vendorProfileError } = await getVendorProfile(user.id);
		if (vendorProfileError) return { user: null, profile: null, error: vendorProfileError };
		if (!vendorProfile) {
			const { error: vendorProfileUpsertError } = await upsertVendorProfile(user.id, {
				business_name: "",
				phone: profile.phone || user.user_metadata?.phone || "",
				city: "",
				description: "",
				logo_url: "",
			});

			if (vendorProfileUpsertError) return { user, profile, error: getErrorMessage(vendorProfileUpsertError) };
		}

		return { user, profile, error: null };
	} catch (error) {
		return { user: null, profile: null, error: getErrorMessage(error) };
	}
}

export function onVendorAuthStateChange(callback) {
	const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
		callback({ user: session?.user || null, event, session });
	});

	return () => subscription?.unsubscribe();
}

export async function getVendorProfile(userId) {
	try {
		const { data, error } = await supabase
			.from("vendor_profiles")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error?.code === "PGRST116") return { profile: null, error: null };
		return { profile: data || null, error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { profile: null, error: getErrorMessage(error) };
	}
}

export async function updateVendorProfile(userId, updates) {
	try {
		const { data, error } = await supabase
			.from("vendor_profiles")
			.update(updates)
			.eq("user_id", userId)
			.select()
			.single();

		return { profile: data || null, error: error ? getErrorMessage(error) : null };
	} catch (error) {
		return { profile: null, error: getErrorMessage(error) };
	}
}

export default {
	signUpCustomer,
	signInCustomer,
	signOutCustomer,
	getCurrentCustomer,
	onAuthStateChange,
	getCustomerProfile,
	updateCustomerProfile,
	signUpVendor,
	signInVendor,
	signOutVendor,
	getCurrentVendor,
	onVendorAuthStateChange,
	getVendorProfile,
	updateVendorProfile,
};
