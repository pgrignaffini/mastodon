class BlockchainInfoController < ApplicationController

    def status_info
        status = Status.find_by(id: params[:status_id])
        render json: status
    end

    def user_info
        user = User.find_by(account_id: params[:account_id])
        render json: user
    end

    def user_update_claim
        user = User.find_by(account_id: params[:account_id])
        user.update(daily_payout_claimed: true)
        render json: user
    end
end