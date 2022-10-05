class User < ApplicationRecord
    
    validates_presence_of :nickname, :username, :password
end
