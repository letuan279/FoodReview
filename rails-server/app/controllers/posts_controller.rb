class PostsController < ApplicationController
    before_action :authorize, only: [:myPost, :addPost, :deletePost, :updatePost]

    # def myPost
    #     @user = authorized_user

    #     numLike(1)
    # end

    def addPost
        
    end

    def deletePost
        
    end

    def updatePost
        
    end

    def numLike(post_id)
        Like.where(post_id: post_id).count(:all)
    end

    def numComment(post_id)
        Comment.where(post_id: post_id).count(:all)
    end

    def liked(user_id, post_id)
        Like.where(user_id: user_id, post_id: post_id).length == 0 ? 0 : 1
    end


    # def get_posts
    #     @user = authorized_user

    #      Post.join(:user).where('user_id' => @user.id)
    # end

    private

    def post_params
        params.require(:post).permit(:address, :description, :time_begin, :time_end, :star)
    end
end
