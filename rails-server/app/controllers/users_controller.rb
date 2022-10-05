require 'bcrypt'

class UsersController < ApplicationController

    def register
        @user = User.find_by username: user_params[:username]

        if @user.nil?
            password = BCrypt::Password.create(user_params[:password])            
            @new_user = User.new({nickname: user_params[:nickname], username: user_params[:username], password: password})
            @new_user.save
            render json: {'user': @new_user, 'success': 'true', 'message': 'Create new user successfully'}
        else
            render json: {'success': 'false', 'message': 'Username exits'}
        end
    end

    def login
        # username
        @user = User.find_by username: user_params[:username]
        if @user.nil?
            render json: {'success': 'false', 'message': 'Incorrect email or password'}
            return
        end
        # password 
        password = BCrypt::Password.new(@user.password)
        if password == user_params[:password]
            token = encode_token({"user_id": @user.id})
            render json: {'success': 'true', 'message': 'Login successfully', 'user': @user, 'token': token}
        else
            render json: {'success': 'false', 'message': 'Incorrect email or password'}
        end
    end

    def current_user
        render json: {'success': 'true', 'user': authorized_user}
    end

    private

    def user_params
        params.require(:user).permit(:nickname, :username, :password)
    end
end
