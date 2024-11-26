import { serve } from 'https://deno.fresh.dev/std@v1/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

interface CreateUserRequest {
  email: string
  password: string
  wallet_address: string
}

serve(async (req) => {
  try {
    // Get request body
    const { email, password, wallet_address } = await req.json() as CreateUserRequest

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create user with admin privileges (bypasses email confirmation)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        wallet_address
      }
    })

    if (createError) {
      throw createError
    }

    return new Response(
      JSON.stringify({
        user: userData.user,
        message: 'User created successfully'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
