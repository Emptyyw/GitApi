import { useState, useEffect } from 'react';
import {
  getUserData,
  getUserRepositories,
  GitHubUser,
  GitHubRepository,
} from '../api/api';

export function useGitHubSearch(userName: string, currentPage: number) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    const loadUserRepositories = async () => {
      try {
        setIsSearching(true);

        const userDataResponse = await getUserData(userName);
        setUser(userDataResponse.data);

        const repositoriesResponse = await getUserRepositories(userName, currentPage, 4);
        setRepositories(repositoriesResponse.data);

        const linkHeader = repositoriesResponse.headers.link;
        if (linkHeader) {
          const totalPagesRegex = /page=(\d+)>; rel="last"/;
          const totalPagesMatch = linkHeader.match(totalPagesRegex);
          if (totalPagesMatch) {
            setTotalPages(Math.ceil(userDataResponse.data.public_repos / 4));
          }
        }
      } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
      } finally {
        setIsSearching(false);
      }
    };

    if (userName) {
      loadUserRepositories();
    }
  }, [userName, currentPage]);

  return { user, setUser, repositories, setRepositories, totalPages, isSearching };
}
