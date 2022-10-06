Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'api/register', to: 'users#register'
  post 'api/login', to: 'users#login'
  get 'api/user', to: 'users#current_user'

  get 'api/posts', to: 'posts#get_posts'
  get 'api/my-posts', to: 'posts#my_posts'
  post 'api/add-post', to: 'posts#add_post'
  delete 'api/delete-post/:post_id', to: 'posts#delete_post'
  post 'api/update-post/:post_id', to: 'posts#update_post'
  post 'api/add-comment/:post_id', to: 'posts#add_post_comment'
  get 'api/like-post/:post_id', to: 'posts#like_post'
  get 'api/like-comment/:comment_id', to: 'posts#like_comment'
  get 'api/comments/:post_id', to: 'posts#get_post_comment'
end
