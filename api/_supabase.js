import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Teams CRUD operations
export const getTeams = async () => {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('score', { ascending: false });
    
    if (error) throw error;
    return data || [];
};

export const addTeam = async (team) => {
    const { data, error } = await supabase
        .from('teams')
        .insert([team])
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const updateTeam = async (id, updates) => {
    const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const deleteTeam = async (id) => {
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
};

export const resetTeams = async () => {
    const { error } = await supabase
        .from('teams')
        .delete()
        .neq('id', '');  // Delete all rows
    
    if (error) throw error;
};
