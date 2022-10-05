class ApplicationController < ActionController::API
    def encode_token(payload)
        JWT.encode(payload, Rails.application.secrets.secret_key_base)
    end

    def decode_token
        auth_header = request.headers['Authorization']
        if auth_header
            token = auth_header.split(' ')[1]
            begin
                JWT.decode(token, Rails.application.secrets.secret_key_base)
            rescue JWT::DecodeError
                nil
            end
        end
    end

    def authorized_user
        decoded_token = decode_token()
        if decoded_token
            p decoded_token
            user_id = decoded_token[0]['user_id']
            @user = User.find_by(id: user_id)
        end
    end

    def authorize
        render json: {'success': 'false', 'message': 'Unauthorized'}, status: :unauthorized unless authorized_user
    end
end
