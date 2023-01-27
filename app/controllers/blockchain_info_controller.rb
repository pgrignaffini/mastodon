class BlockchainInfoController < ApplicationController
    def all_users
      users = User.all
      render json: users
    end

    def user_info
        user = User.find_by(account_id: params[:account_id])
        render json: user
    end

    def user_update_claim
        user = User.find_by(account_id: params[:account_id])
        user.update(moderator: true)
        render json: user
    end
end