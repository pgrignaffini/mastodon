
class Api::V1::TextToImageController < Api::BaseController

  def create

    prompt = params[:prompt]
    style = params[:style]

    body = {
      prompt: prompt,
      style: style
    }.to_json

    req = Request.new(:post, "#{base_url}/sdapi/v1/txt2imgLab", body: body)
    req.add_headers({ 'Content-Type' => 'application/json; charset=UTF-8' })
    req.add_headers({ 'Accept' => 'application/json' })
    req.perform do |res|
      data = JSON.parse(res.body)
      render json: data.to_json
    end
  end

  def progress

    req = Request.new(:get, "#{base_url}/sdapi/v1/progress")
    req.add_headers({ 'Content-Type' => 'application/json; charset=UTF-8' })
    req.add_headers({ 'Accept' => 'application/json' })
    req.perform do |res|
      data = JSON.parse(res.body)
      render json: data.to_json
    end
  end

  def images

    job_hash = params[:job_hash]

    req = Request.new(:get, "#{base_url}/file=outputs/api_imgs/#{job_hash}.txt")
    req.add_headers({ 'Accept' => 'application/json' })
    req.perform do |res|
      data = res.body
      render json: data.to_json
    end
  end

  private

  def base_url
    'http://67.160.99.203:3000'
  end
end
