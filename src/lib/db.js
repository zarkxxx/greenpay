import { supabase } from './supabase'

// Add points and log transaction
export async function addPoints(userId, points, label, machineId = null) {
  // Insert transaction
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'earn',
      label,
      points,
      machine_id: machineId
    })

  if (txError) throw txError

  // Update profile points and bottles
  const { error: profileError } = await supabase.rpc('increment_points', {
    user_id: userId,
    pts: points,
    btls: 1
  })

  if (profileError) throw profileError
}

// Redeem points
export async function redeemPoints(userId, cost, rewardTitle, rewardBrand) {
  // Check balance first
  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single()

  if (!profile || profile.points < cost) {
    throw new Error('Insufficient points')
  }

  // Generate coupon code
  const code = `GP-${rewardBrand.toUpperCase().slice(0, 4)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  // Insert transaction
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'redeem',
    label: `Redeemed: ${rewardTitle}`,
    points: -cost
  })

  // Insert coupon
  const { data: coupon } = await supabase.from('coupons').insert({
    user_id: userId,
    brand: rewardBrand,
    title: rewardTitle,
    code,
    cost,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }).select().single()

  // Deduct points
  await supabase.rpc('decrement_points', {
    user_id: userId,
    pts: cost
  })

  return coupon
}

// Fetch transactions
export async function getTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

// Fetch coupons
export async function getCoupons(userId) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Fetch leaderboard
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bottles')
    .order('bottles', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}
