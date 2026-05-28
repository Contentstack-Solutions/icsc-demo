import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const event_id = request.nextUrl.searchParams.get('event_id');

    const { data, error } = await supabase
      .from('icsc_attendees')
      .select('id, name, title, company, avatar_url')
      .eq('event_id', event_id)
      .limit(6);

    if (error) throw error;

    return Response.json(data || []);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch attendees' }, { status: 500 });
  }
}
