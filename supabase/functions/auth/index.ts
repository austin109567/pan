import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { publicKey, signature } = await req.json()

    if (!publicKey || !signature) {
      return new Response(
        JSON.stringify({ error: 'Missing publicKey or signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('auth.users')
      .select('id')
      .eq('email', `${publicKey}@raidrally.io`)
      .single()

    let userId

    if (!existingUser) {
      // Create new user
      const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: `${publicKey}@raidrally.io`,
        password: signature.slice(0, 72),
        email_confirm: true,
        user_metadata: { wallet_address: publicKey }
      })

      if (createError) throw createError
      userId = user?.id
    } else {
      userId = existingUser.id
    }

    // Generate session
    const { data: { session }, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
      user_id: userId
    })

    if (sessionError) throw sessionError

    return new Response(
      JSON.stringify({ session }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
