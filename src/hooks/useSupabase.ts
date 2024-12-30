import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

export function useSupabase() {
  const { setProjetos, setEtapas, setTarefas, setMateriais, setTransacoes } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjetos(projects);

        // Fetch other data similarly...

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const projectsSubscription = supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, 
        payload => {
          setProjetos(current => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...current, payload.new];
              case 'UPDATE':
                return current.map(p => p.id === payload.new.id ? payload.new : p);
              case 'DELETE':
                return current.filter(p => p.id !== payload.old.id);
              default:
                return current;
            }
          });
        })
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
    };
  }, []);

  return { loading, error };
}