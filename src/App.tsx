import React, { useState } from 'react';
import { AppProvider, useApp } from './store';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CharacterRegistration from './components/CharacterRegistration';
import TemplateSelector from './components/TemplateSelector';
import Editor from './components/Editor';
import { Character, Template } from './types';
import { TEMPLATES } from './constants';

function AppContent() {
  const { user, loading, characters, setUser } = useApp();
  const [screen, setScreen] = useState<'landing' | 'dashboard' | 'char_reg' | 'temp_sel' | 'editor'>('landing');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Sync screen with auth state
  React.useEffect(() => {
    if (!loading) {
      if (user && screen === 'landing') {
        setScreen('dashboard');
      } else if (!user && screen !== 'landing') {
        setScreen('landing');
      } else if (screen === 'editor' && !selectedTemplate) {
        setScreen('dashboard');
      }
    }
  }, [user, loading, screen, selectedTemplate]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">Loading...</div>;

  const handleLogin = () => {
    const mockUser = { id: '1', name: 'ユーザー', email: 'test@example.com', plan: 'free' as const };
    setUser(mockUser);
    setScreen('dashboard');
  };

  // Determine which screen to actually show
  const activeScreen = !user ? 'landing' : (screen === 'landing' ? 'dashboard' : screen);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {activeScreen === 'landing' && (
        <LandingPage onLogin={handleLogin} />
      )}
      {activeScreen === 'dashboard' && (
        <Dashboard 
          onAddCharacter={() => setScreen('char_reg')} 
          onNewProject={() => setScreen('temp_sel')}
          onEditProject={(proj) => {
            const char = characters.find(c => c.id === proj.character_id);
            const temp = TEMPLATES.find(t => t.id === proj.template_id);
            if (char && temp) {
              setSelectedCharacter(char);
              setSelectedTemplate(temp);
              setEditingProjectId(proj.id);
              setScreen('editor');
            }
          }}
        />
      )}
      {activeScreen === 'char_reg' && (
        <CharacterRegistration 
          onComplete={(char) => {
            setSelectedCharacter(char);
            setScreen('dashboard');
          }} 
          onCancel={() => setScreen('dashboard')}
        />
      )}
      {activeScreen === 'temp_sel' && (
        <TemplateSelector 
          onSelect={(temp) => {
            setSelectedTemplate(temp);
            setScreen('editor');
          }}
          onCancel={() => setScreen('dashboard')}
        />
      )}
      {activeScreen === 'editor' && selectedTemplate && (
        <Editor 
          template={selectedTemplate}
          projectId={editingProjectId}
          onBack={() => setScreen('dashboard')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
