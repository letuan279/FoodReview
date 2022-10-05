class CreatePosts < ActiveRecord::Migration[5.0]
  def change
    create_table :posts do |t|
      t.string :address
      t.text :description
      t.time :time_begin
      t.time :time_end
      t.integer :star
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
