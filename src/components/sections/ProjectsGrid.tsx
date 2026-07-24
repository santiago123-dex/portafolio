import { useRef, useState, useCallback } from 'react';

interface ProjectData {
  title: string;
  description: string;
  tech: string[];
  type: string;
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
}

const TYPE_LABELS: Record<string, string> = {
  visual: 'Visual',
  technical: 'Técnico',
  mixed: 'Mixto',
};

function ProjectCard({ project }: { project: ProjectData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>(
    project.image ? 'loading' : 'error',
  );

  const onImgLoad = useCallback(() => setImgState('loaded'), []);
  const onImgError = useCallback(() => setImgState('error'), []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    const glare = cardRef.current.querySelector('.card-glare') as HTMLElement;
    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--color-primary) 15%, transparent), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    const glare = cardRef.current.querySelector('.card-glare') as HTMLElement;
    if (glare) {
      glare.style.background = 'transparent';
    }
  };

  const hasImage = !!project.image;
  const isError = imgState === 'error';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative glass rounded-2xl overflow-hidden transition-all duration-200 ease-out cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="card-glare absolute inset-0 z-10 pointer-events-none transition-all duration-200" />

      <div className="relative h-48 overflow-hidden bg-border/20" style={{ transform: 'translateZ(30px)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), color-mix(in srgb, var(--color-secondary) 10%, transparent), color-mix(in srgb, var(--color-accent) 10%, transparent))' }} />

        {imgState === 'loading' && hasImage && (
          <div className="shimmer absolute inset-0 z-[2]" />
        )}

        {hasImage && (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            onLoad={onImgLoad}
            onError={onImgError}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isError ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isError || !hasImage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">✦</span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono capitalize"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            {TYPE_LABELS[project.type] || project.type}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4" style={{ transform: 'translateZ(50px)' }}>
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-muted text-sm leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 text-xs font-mono bg-border/30 text-muted rounded-md border border-border/50">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-4 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Código
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsGrid({ projects }: { projects: ProjectData[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
}
