'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { DEFAULT_STATE } from './constants';

const WorkspaceContext = createContext(null);

function generateTabId() {
  return Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function WorkspaceProvider({ children }) {
  const [tabId] = useState(() => generateTabId());
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState(() => ({ 
    ...DEFAULT_STATE, 
    sourceTabId: tabId, 
    timestamp: 0 
  }));
  const [activeTabs, setActiveTabs] = useState({});
  
  const stateRef = useRef(state);
  stateRef.current = state;
  const channelRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const channel = new BroadcastChannel('emi-workspace-sync');
    channelRef.current = channel;

    channel.postMessage({ type: 'REQUEST_STATE', from: tabId });

    channel.onmessage = (e) => {
      const msg = e.data;
      if (!msg) return;

      if (msg.type === 'REQUEST_STATE') {
        channel.postMessage({ type: 'SYNC_STATE', state: stateRef.current });
      } else if (msg.type === 'SYNC_STATE' || msg.type === 'STATE_UPDATE') {
        if (msg.state.timestamp > stateRef.current.timestamp) {
          setState(msg.state);
        }
      } else if (msg.type === 'HEARTBEAT') {
        setActiveTabs(prev => ({ ...prev, [msg.from]: Date.now() }));
      } else if (msg.type === 'TAB_CLOSE') {
        setActiveTabs(prev => {
          const next = { ...prev };
          delete next[msg.from];
          return next;
        });
      }
    };

    const heartbeatInterval = setInterval(() => {
      channel.postMessage({ type: 'HEARTBEAT', from: tabId });
      
      const now = Date.now();
      setActiveTabs(prev => {
        const next = { ...prev };
        let changed = false;
        Object.entries(next).forEach(([id, lastSeen]) => {
          if (now - lastSeen > 4000) {
            delete next[id];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 2000);

    const handleBeforeUnload = () => {
      channel.postMessage({ type: 'TAB_CLOSE', from: tabId });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      channel.postMessage({ type: 'TAB_CLOSE', from: tabId });
      channel.close();
    };
  }, [tabId]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const updateState = useCallback((partial) => {
    setState(prev => {
      const nextState = { ...prev, ...partial, timestamp: Date.now(), sourceTabId: tabId };
      channelRef.current?.postMessage({ type: 'STATE_UPDATE', state: nextState });
      return nextState;
    });
  }, [tabId]);

  const activeTabsCount = Object.keys(activeTabs).length + 1;
  const isLeader = Object.keys(activeTabs).every(id => id > tabId);

  return (
    <WorkspaceContext.Provider value={{ isMounted, tabId, activeTabsCount, state, updateState, isLeader }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
}
