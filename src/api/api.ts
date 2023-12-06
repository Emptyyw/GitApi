import axios, { AxiosResponse } from 'axios'

export interface GitHubUser {
	login: string
	avatar_url: string
	name: string
	followers: number
	following: number
	public_repos: number
}
export interface GitHubRepository {
	name: string
	description: string
	html_url: string
	id: number
}

// создаем экземпляр  с базовым URL он позволяет делать запросы к апи например baseURL/users
const axiosInstance = axios.create({
	baseURL: 'https://api.github.com',
})
///getUserData делает get запрос для получения данных
//userName в качестве параметра, формирует юрл и возвращает промис
export const getUserData = async (
	userName: string
): Promise<AxiosResponse<GitHubUser>> => {
	return axiosInstance.get(`/users/${userName}`)
}

//getUserRepositories делает get запрос для получения списка
//принимает userName, а также параметры page и perPage
//возвращает промис, который будет разрешен объектом AxiosResponse<GitHubRepository[]>
export const getUserRepositories = async (
	userName: string,
	page: number = 1,
	perPage: number = 4
): Promise<AxiosResponse<GitHubRepository[]>> => {
	return axiosInstance.get(`/users/${userName}/repos`, {
		params: { page, per_page: perPage },
	})
}
