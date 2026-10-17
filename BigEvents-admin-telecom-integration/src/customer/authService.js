import { supabase } from "../lib/supabase.js";

/**
 * Customer Authentication Service
 * Handles Supabase Auth for customer login, registration, and session management
 */

/**
 * Register a new customer
 * @param {string} email - Customer email
 * @param {string} password - Customer password
 * @param {string} name - Customer full name
 * @param {string} phone - Customer phone number
 * @returns {Promise<{user, error}>}
 */
export async function signUpCustomer(email, password, name, phone) {
  try {
    // Sign up with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { user: null, error: signUpError.message };
    }

    const { user } = data;

    // Create profile record in profiles table
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        email: user.email,
        name: name || "",
        phone: phone || "",
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // Don't fail - auth succeeded even if profile creation had issues
      }
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in an existing customer
 * @param {string} email - Customer email
 * @param {string} password - Customer password
 * @returns {Promise<{user, error}>}
 */
export async function signInCustomer(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign out the current customer
 * @returns {Promise<{error}>}
 */
export async function signOutCustomer() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Get the current authenticated customer
 * @returns {Promise<{user, error}>}
 */
export async function getCurrentCustomer() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Listen for auth state changes
 * @param {function} callback - Called with {user, event}
 * @returns {function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback({
      user: session?.user || null,
      event,
    });
  });

  return () => subscription?.unsubscribe();
}

/**
 * Get customer profile from profiles table
 * @param {string} userId - User ID
 * @returns {Promise<{profile, error}>}
 */
export async function getCustomerProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found, which is expected for new users
      return { profile: null, error: error.message };
    }

    return { profile: data || null, error: null };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

/**
 * Update customer profile
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<{profile, error}>}
 */
export async function updateCustomerProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}
