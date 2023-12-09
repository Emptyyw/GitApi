import React, { useState, useEffect } from 'react';
import { getUserData } from '../api/api';
import img from '../img/Search.svg';
import logo from '../img/GitHub.svg';
import search from '../img/Search.svg';
import Followers from '../utils/FormatNumber';
import renderPageNumbers from '../utils/paginationUtils';
import { useGitHubSearch } from '../hooks/useGitHubSearch';
import useDebounce from '../hooks/useDebounce';

const GitHubSearch: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [debouncedUserName] = useDebounce<string>(userName, 0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { user, setUser, repositories, totalPages, isSearching } = useGitHubSearch(
    debouncedUserName,
    currentPage,
  );

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await getUserData(debouncedUserName);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const pagination = renderPageNumbers({
    currentPage,
    totalPages,
    handlePageChange,
  });

  return (
    <div>
      <form onSubmit={handleSearch}>
        <nav className="nav">
          <img className="imgGit" src={logo} alt="логотип" />
          <div className="input-group">
            <input
              className="search"
              type="text"
              placeholder="Enter GitHub username"
              value={userName}
              onChange={handleSearchChange}
            />
            <img className="search-icon" src={search} alt="" />
          </div>
        </nav>
      </form>

      {userName === '' && !isSearching ? (
        <div className="searching">
          <div className="searching-item">
            <img className="img" src={img} alt="" />
            <h1 className="title">
              Start with searching a <br /> GitHub user
            </h1>
          </div>
        </div>
      ) : (
        user && (
          <div className="wrapper">
            <div className="user">
              <img className="avatar" src={user.avatar_url} alt="User Avatar" />

              <p className="userName">{user.name}</p>
              <p className="userLogin">
                {user.name}
                {user.login}
              </p>
              <div className="followers">
                <Followers followers={user.followers} following={user.following} />
              </div>
            </div>
            {repositories && (
              <div className="repo">
                <ul className="repo-wrapper">
                  <h2 className="repo-title">Repositories({user.public_repos})</h2>
                  {repositories.map((repo) => (
                    <li className="repo-item" key={repo.id}>
                      <a
                        href={repo.html_url}
                        className="repo-item__link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                      <p className="repo-item__description">{repo.description}</p>
                    </li>
                  ))}
                </ul>
                <div className="pagination">
                  <button
                    className="arrow-pagination"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {pagination}
                  <button
                    className="arrow-pagination"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default GitHubSearch;
