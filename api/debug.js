import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const diagnostics = {
        timestamp: new Date().toISOString(),
        env: {
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
            supabaseUrlPrefix: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : null
        },
        tests: {}
    };

    // Test 1: Can we create the client?
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_ANON_KEY || ''
        );
        diagnostics.tests.clientCreated = true;

        // Test 2: Can we query the teams table?
        try {
            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .limit(5);

            if (error) {
                diagnostics.tests.selectQuery = { success: false, error: error.message, code: error.code, details: error.details };
            } else {
                diagnostics.tests.selectQuery = { success: true, rowCount: data?.length || 0, data };
            }
        } catch (e) {
            diagnostics.tests.selectQuery = { success: false, error: e.message };
        }

        // Test 3: Can we insert a test row?
        try {
            const testTeam = {
                name: 'TEST_TEAM_' + Date.now(),
                members: '[]',
                score: 999,
                round: 1
            };

            const { data, error } = await supabase
                .from('teams')
                .insert([testTeam])
                .select()
                .single();

            if (error) {
                diagnostics.tests.insertQuery = { success: false, error: error.message, code: error.code, details: error.details, hint: error.hint };
            } else {
                diagnostics.tests.insertQuery = { success: true, insertedId: data?.id };

                // Clean up test row
                if (data?.id) {
                    await supabase.from('teams').delete().eq('id', data.id);
                    diagnostics.tests.cleanup = { success: true };
                }
            }
        } catch (e) {
            diagnostics.tests.insertQuery = { success: false, error: e.message };
        }

    } catch (e) {
        diagnostics.tests.clientCreated = false;
        diagnostics.tests.clientError = e.message;
    }

    return res.status(200).json(diagnostics);
}
