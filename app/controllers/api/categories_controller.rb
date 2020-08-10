class Api::CategoriesController < ApplicationController
  def index
    category = Category.find(params[:category_id])
    categories = category.children
    render json: { categories: categories }
  end
end
