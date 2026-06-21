import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';
import { WorkspaceProvider } from '@/lib/workspace-context';

export default function Home() {
  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <MainContent />
      </div>
    </WorkspaceProvider>
  );
}
