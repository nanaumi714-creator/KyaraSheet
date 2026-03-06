import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Character, Project, Plan } from './types';

interface AppState {
  user: User | null;
  characters: Character[];
  projects: Project[];
  loading: boolean;
  setUser: (user: User | null) => void;
  addCharacter: (char: Character) => void;
  addProject: (proj: Project) => void;
  updateProject: (proj: Project) => void;
  deleteProject: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock initial load
    const savedChars = localStorage.getItem('vt_chars');
    const savedProjs = localStorage.getItem('vt_projs');
    const savedUser = localStorage.getItem('vt_user');

    if (savedChars) setCharacters(JSON.parse(savedChars));
    if (savedProjs) setProjects(JSON.parse(savedProjs));
    if (savedUser) setUser(JSON.parse(savedUser));

    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('vt_chars', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem('vt_projs', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (user) localStorage.setItem('vt_user', JSON.stringify(user));
    else localStorage.removeItem('vt_user');
  }, [user]);

  const addCharacter = (char: Character) => setCharacters(prev => [...prev, char]);
  const addProject = (proj: Project) => setProjects(prev => [...prev, proj]);
  const updateProject = (proj: Project) => setProjects(prev => prev.map(p => p.id === proj.id ? proj : p));
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));

  return (
    <AppContext.Provider value={{
      user, characters, projects, loading,
      setUser, addCharacter, addProject, updateProject, deleteProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
