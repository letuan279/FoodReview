class Image < ApplicationRecord
  belongs_to :post

  validates_presence_of :image_url
end
