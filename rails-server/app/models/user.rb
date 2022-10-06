class User < ApplicationRecord
    has_many :comments
    
    validates_presence_of :nickname, :username, :password
end
