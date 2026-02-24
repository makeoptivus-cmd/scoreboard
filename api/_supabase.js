import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
    });
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Teams CRUD operations
export const getTeams = async () => {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('score', { ascending: false });

    if (error) throw error;

    // Parse members JSON for each team
    return (data || []).map(team => ({
        ...team,
        members: team.members ? JSON.parse(team.members) : []
    }));
};

export const addTeam = async (team) => {
    console.log('Adding team:', team);
    const { data, error } = await supabase
        .from('teams')
        .insert([{
            name: team.name,
            members: JSON.stringify(team.members || []),
            score: team.score,
            round: team.round
        }])
        .select()
        .single();

    console.log('Insert result:', { data, error });
    if (error) throw error;

    // Parse members back to array
    if (data && data.members) {
        data.members = JSON.parse(data.members);
    }
    return data;
};

export const updateTeam = async (id, updates) => {
    const updateData = {
        name: updates.name,
        score: updates.score,
        round: updates.round
    };
    if (updates.members) {
        updateData.members = JSON.stringify(updates.members);
    }

    const { data, error } = await supabase
        .from('teams')
        .update(updateData)
        .eq('id', Number(id))
        .select()
        .single();

    if (error) throw error;

    if (data && data.members) {
        data.members = JSON.parse(data.members);
    }
    return data;
};

export const deleteTeam = async (id) => {
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', Number(id));

    if (error) throw error;
};

export const resetTeams = async () => {
    const { error } = await supabase
        .from('teams')
        .delete()
        .gte('id', 0);  // Delete all rows

    if (error) throw error;
};
