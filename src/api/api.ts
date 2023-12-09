import axios, { AxiosResponse } from 'axios';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  followers: number;
  following: number;
  public_repos: number;
}
export interface GitHubRepository {
  name: string;
  description: string;
  html_url: string;
  id: number;
}

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
});
export const getUserData = async (
  userName: string,
): Promise<AxiosResponse<GitHubUser>> => {
  return axiosInstance.get(`/users/${userName}`);
};

export const getUserRepositories = async (
  userName: string,
  page: number = 1,
  perPage: number = 4,
): Promise<AxiosResponse<GitHubRepository[]>> => {
  return axiosInstance.get(`/users/${userName}/repos`, {
    params: { page, per_page: perPage },
  });
};
