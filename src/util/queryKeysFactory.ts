export const usersQueryKeys = {
    all: () => ['users'],
    usersFilterd: ({ page, is_active, is_ban, keyword }: { page?: string; is_ban?: string; is_active?: string; keyword?: string }) => [
        ...usersQueryKeys.all(),
        { page },
        { is_active },
        { is_ban },
        { keyword }
    ],
    getUser: (userId: string) => [
        usersQueryKeys.all(),
        'one',
        { userId }
    ]
}
export const citiesQueryKeys = {
    all: () => ['cities'],
    paginate: () => [...citiesQueryKeys.all(), 'paginate'],
    getCity: (cityId?: string| number) => [
        usersQueryKeys.all(),
        'one',
        { cityId }
    ],
    filterd: (params: {
        page?: string
        is_active?: string
        sort?: string
        created_at?: string
        search?: string
        country_id?: string
    }) => {
        const cleaned = Object.fromEntries(
            Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== '')
            )
        return [
        ...citiesQueryKeys.paginate(),
            cleaned
            ]
}
}
export const countriesQueryKeys = {
    all: ()=> ['countries', 'paginate'],
    getCountry: (countryId?: string)=>[countriesQueryKeys.all(), 'one', { countryId }],
    filterd: (search: any) => [...countriesQueryKeys.all(), search] as const,
}

export const pagesQueryKeys = {
  all: () => ['static-pages', 'paginate'],
  getPage: (pageId?: string) => [pagesQueryKeys.all(), 'one', { pageId }],
  filterd: (search: any) => {
    const cleaned = Object.fromEntries(
            Object.entries(search ?? {}).filter(([, v]) => v !== undefined && v !== '')
            )
    return [...pagesQueryKeys.all(), cleaned] as const},
}