class CreateImages < ActiveRecord::Migration[5.0]
  def change
    create_table :images do |t|
      t.references :post, foreign_key: true
      t.string :image_url

      t.timestamps
    end
  end
end
