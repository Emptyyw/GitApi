import React, { useState, useEffect } from 'react';
import {
  getUserData,
  getUserRepositories,
  GitHubUser,
  GitHubRepository,
} from '../api/api';
import img from '../img/Search.svg';
import logo from '../img/GitHub.svg';
import search from '../img/Search.svg';
import Followers from '../utils/FormatNumber';
import renderPageNumbers from '../utils/paginationUtils';
import { useDebounce } from 'use-debounce';

const GitHubSearch: React.FC = () => {
  // Состояния компонента --> useState для определения различных состояний
  //userName для хранения  имени пользователя
  //user для хранения данных о пользователе
  //repositories для хранения данных о репозиториях
  //currentPage для отслеживания текущей страницы и totalPages для хранения общего количества страниц
  const [userName, setUserName] = useState<string>('');
  const [debouncedUserName] = useDebounce<string>(userName, 300);

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Новая переменная состояния для отслеживания поиска >>>>
  const [isSearching, setIsSearching] = useState<boolean>(false);

  //useEffect используется для выполнения побочных эффектов
  //когда изменяются значения user или currentPage,
  // вызывается функция loadUserRepositories для загрузки репозиториев пользователя.

  useEffect(() => {
    if (debouncedUserName) {
      loadUserRepositories();
    }
  }, [debouncedUserName, currentPage]);
  //loadUserRepositories асинхронно загружает репозитории
  const loadUserRepositories = async () => {
    try {
      setIsSearching(true);

      // Получаем данные о пользователе
      const userDataResponse = await getUserData(debouncedUserName); // Используем debouncedUserName
      setUser(userDataResponse.data);
      // Получаем репозитории пользователя
      const repositoriesResponse = await getUserRepositories(
        debouncedUserName,
        currentPage,
        4,
      );

      setRepositories(repositoriesResponse.data);

      // Устанавливаем общее количество страниц
      const linkHeader = repositoriesResponse.headers.link;
      if (linkHeader) {
        const totalPagesRegex = /page=(\d+)>; rel="last"/;
        const totalPagesMatch = linkHeader.match(totalPagesRegex);
        if (totalPagesMatch) {
          // Используем Math.ceil для округления вверх чтобы учесть все репозитории пользователя
          setTotalPages(Math.ceil(userDataResponse.data.public_repos / 4));
        }
      }
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
    } finally {
      setIsSearching(false);
    }
  };
  //handleSearch вызывается при отправке формы для поиска
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      ///getUserData для получения данных о пользователе и отправляет полученные данные
      // в состояние юзер
      const response = await getUserData(debouncedUserName); // Используем debouncedUserName
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  };
  //handlePageChange вызывается при изменении страницы и обновляет состояние currentPage
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Устанавливаем поиск по вводу onChange вызывает
  //функцию handleSearchChange при каждом изменении в поле ввода
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

              <p
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  color: '#0064EB',
                  fontSize: '15px',
                  fontWeight: '400',
                }}
              >
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
