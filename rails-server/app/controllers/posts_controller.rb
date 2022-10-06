class PostsController < ApplicationController
    before_action :authorize, only: [:myPost, :addPost, :deletePost, :updatePost]
    
    def get_posts
        @user = authorized_user

        data = Post.order(updated_at: :desc).as_json
        new_data = data.map do |x|
                x[:numLike] = numLike(x['id'])
                x[:numComment] = numComment(x['id'])
                x[:liked] = likedPost(@user.id, x['id'])
                x
            end
        render json: {'success': 'true', 'posts': new_data}
    end

    def my_posts
        @user = authorized_user
        data = Post.order(updated_at: :desc).find_by(user_id: @user.id).as_json
        data = [data]
        new_data = data.map do |x|
            x[:numLike] = numLike(x['id'])
            x[:numComment] = numComment(x['id'])
            x[:liked] = likedPost(@user.id, x['id'])
            x
        end
        render json: {'success': 'true', 'myPosts': new_data}
    end

    def add_post
        @user = authorized_user

        @post = Post.new(post_params)
        @post.user_id = @user.id
        @post.save
        render json: {'success': 'true', 'message': 'created successfully', 'post': @post}
    end

    def delete_post
        @post = Post.find_by id: params[:post_id]

        if @post.nil?
            render json: {'success': 'false', 'message': 'post not exits'}
            return
        else
            Post.destroy(params[:post_id])
            render json: {'success': 'true', 'message': 'deleted post'}
        end
    end

    def update_post
        @post = Post.find_by id: params[:post_id]

        if @post.nil?
            render json: {'success': 'false', 'message': 'post not exits'}
            return
        else
            @post.update(post_params)
            render json: {'success': 'true', 'message': 'updated post'}
        end
    end

    def add_post_comment
        @user = authorized_user

        Comment.create({post_id: params[:post_id], user_id: @user.id, content: params[:content]})
        render json: {'success': 'true', 'message': 'Comment created'}
    end

    def like_post
        @user = authorized_user

        liked = Like.find_by(user_id: @user.id, post_id: params[:post_id])

        if liked.nil?
            Like.create({post_id: params[:post_id], user_id: @user.id})
            render json: {'success': 'true', 'action': 'like'}
            return
        else
            liked.delete
            render json: {'success': 'true', 'action': 'dislike'}
        end
    end

    def like_comment
        @user = authorized_user

        liked = LikeComment.find_by(user_id: @user.id, comment_id: params[:comment_id])

        if liked.nil?
            LikeComment.create({comment_id: params[:comment_id], user_id: @user.id})
        else
            liked.delete
        end

        render json: {'success': 'true', 'message': 'like comment successfully', 'result': numLikeCmt(params[:comment_id])}
    end
    
    def get_post_comment
        @user = authorized_user

        sql = "SELECT  
        users.nickname,
        comments.content,
        comments.id,
        comments.created_at,
        comments.user_id
        FROM comments,users
        WHERE users.id = comments.user_id AND post_id = #{params[:post_id]}
        ORDER BY comments.created_at ASC"
        records_array = ActiveRecord::Base.connection.exec_query(sql)
        new_data = records_array.map do |x|
            x[:numLike] = numLikeCmt(x['id'])
            x[:Liked] = likedComment(@user.id, x['id'])
            x
        end
        render json: {'success': 'true', 'comments': new_data}
    end

    def numLike(post_id)
        Like.where(post_id: post_id).count(:all)
    end

    def numLikeCmt(comment_id)
        LikeComment.where(comment_id: params[:comment_id]).count(:all)
    end

    def numComment(post_id)
        Comment.where(post_id: post_id).count(:all)
    end

    def likedPost(user_id, post_id)
        Like.where(user_id: user_id, post_id: post_id).length == 0 ? 0 : 1
    end

    def likedComment(user_id, comment_id)
        LikeComment.where(user_id: user_id, comment_id: comment_id).length == 0 ? 0 : 1
    end


    private

    def post_params
        params.permit(:address, :description, :time_begin, :time_end, :star, :picture)
    end
end
