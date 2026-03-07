import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Character, Project } from './types';

function safeParse<T>(raw: string | null, validate: (value: unknown) => value is T): T | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

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
    const savedChars = safeParse<Character[]>(
      localStorage.getItem('vt_chars'),
      (value): value is Character[] => Array.isArray(value),
    );
    const savedProjs = safeParse<Project[]>(
      localStorage.getItem('vt_projs'),
      (value): value is Project[] => Array.isArray(value),
    );
    const savedUser = safeParse<User>(
      localStorage.getItem('vt_user'),
      (value): value is User => typeof value === 'object' && value !== null,
    );

    if (savedChars) {
      setCharacters(savedChars);
    } else {
      localStorage.removeItem('vt_chars');
    }

    if (savedProjs) {
      setProjects(savedProjs);
    } else {
      localStorage.removeItem('vt_projs');
    }

    if (savedUser) {
      setUser(savedUser);
    } else {
      localStorage.removeItem('vt_user');
    }

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
