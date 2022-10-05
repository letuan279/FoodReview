Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'api/register', to: 'users#register'
  post 'api/login', to: 'users#login'
  get 'api/user', to: 'users#current_user'

  get 'api/posts', to: 'posts#get_posts'
end
