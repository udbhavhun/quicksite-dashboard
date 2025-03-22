
// Use this script only for development purposes
// To create an admin user, run the following in the Supabase SQL editor:

/*
-- Create the admin user:
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    confirmation_sent_at,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'admin@example.com',
    -- This is a hashed version of 'admin123'
    -- NEVER use such a simple password in production
    '$2a$10$rEwj8hzYGbvQwh7Wcd7zXeeT6YUMHCCu7KV4nOlI1rp8H0A6fqnpS',
    now(),
    now(),
    now(),
    now(),
    now()
);

-- Get the ID of the user we just created
DO $$ 
DECLARE 
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@example.com';
    
    -- Create the profile with admin role
    INSERT INTO public.profiles (
        id, 
        email, 
        name, 
        role, 
        created_at, 
        updated_at
    ) 
    VALUES (
        admin_id, 
        'admin@example.com', 
        'Admin User', 
        'admin', 
        now(), 
        now()
    );
END $$;
*/

// Admin login details:
// Email: admin@example.com
// Password: admin123
// 
// Regular customer login:
// Create via the signup form
