// hooks/useVersion.ts
"use client";

import { useState, useEffect } from 'react';

interface GitHubRelease {
  tag_name: string;
}

const useVersion = () => {
  const [version, setVersion] = useState<string>('3.1');

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/vznh/mole/releases/latest');
        if (response.ok) {
          const release: GitHubRelease = await response.json();
          setVersion(release.tag_name);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub release:', error);
      }
    };

    fetchLatestRelease();
  }, []);

  return version;
};

export { useVersion };
