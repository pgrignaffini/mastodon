import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Button from 'mastodon/components/button';

const ImageGenerator = () => {

    const [prompt, setPrompt] = React.useState('');
    const [style, setStyle] = React.useState('freestyle');
    const [isLoading, setIsLoading] = React.useState(false);
    const [request, setRequest] = React.useState(undefined);
    const [progress, setProgress] = React.useState(undefined);

    const text2Image = async (e) => {
        e.preventDefault();
        if (!prompt) return;
        setIsLoading(true);
        const response = await axios
            .post('/api/v1/text_to_image/create', {
                prompt,
                style,
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
        setRequest(response?.data);
        return response;
    };

    const checkProgress = async () => {
        if (!request) return;
        const response = await axios.get('/api/v1/text_to_image/progress', {
            params: {
                skip_current_image: false,
                job_no: request.job_no,
            },
        }).catch((error) => {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                return error.message;
            } else {
                return 'An unexpected error occurred';
            }
        });
        let progress = response?.data;
        progress.state.done = false;
        if (
            progress.state.job_no === request.job_no &&
            progress.state.job !== request.job_hash
        )
            progress.state.done = true;
        if (progress.state.job_no === 0 && progress.state.job_count === 0)
            progress.state.done = true;
        return progress;
    };

    const getImages = async () => {
        const response = await axios.get('/api/v1/text_to_image/images', {
            params: { job_hash: request?.job_hash },
        }).catch((error) => {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                return error.message;
            } else {
                return 'An unexpected error occurred';
            }
        });

        const images = response?.data.join('');
        const splitImages = images.split('\n');
        return splitImages;
    };

    const { data: progressData } = useQuery(
        'progress',
        () => checkProgress(request),
        {
            enabled:
                !!request && (progress?.state.done === false || progress === undefined),
            refetchInterval: 1000,
            onSuccess(data) {
                setProgress(data);
            },
        },
    );

    const { data: images } = useQuery('images', getImages, {
        enabled: !!progress && progress.state.done,
        onSuccess: () => {
            setRequest(undefined);
            setProgress(undefined);
            setIsLoading(false);
        },
    });

    const label = 'Your prompt here';
    const title = 'Generate';
    const progressPercentage = progress ? (progress.progress * 100).toFixed(0) : 0;

    return (
        <div style={{ backgroundColor: '#282C37', minHeight: '100vh' }}>
            <form style={{ padding: '1rem' }} onSubmit={(e) => text2Image(e)}>
                <label>
                    <span style={{ display: 'none' }}>{label}</span>
                    <input
                        style={{ width: '100%' }}
                        type='text'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className='setting-text'
                        disabled={isLoading}
                        placeholder={label}
                    />
                </label>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <select style={{ padding: '0.5rem', borderRadius: '0.3rem', width: '50%', flex: '1 1 auto', outline: 'none' }} value={style} onChange={(e) => setStyle(e.target.value)}>
                        <option value={'freestyle'}>Freestyle</option>
                        <option value={'rendered-object-collection'}>Rendered Object</option>
                        <option value={'cute-creature-collection'}>Cute Creature</option>
                        <option value={'isometric-room-collection'}>Isometric Room</option>
                        <option value={'low-poly-creature-collection'}>Low Poly Creature</option>
                        <option value={'block-structure-collection'}>Block Structure</option>
                        <option value={'sport-team-logo-collection'}>Sport Team Logo</option>
                        <option value={'gold-pendant-wireframe-collection'}>Gold Pendant</option>
                        <option value={'surreal-micro-world-collection'}>Surreal Micro World</option>
                        <option value={'hyper-realistic-anime-portrait-collection'}>Anime Portrait</option>
                        <option value={'cute-sticker-collection'}>Cute Sticker</option>
                        <option value={'space-hologram-collection'}>Space Hologram</option>
                        <option value={'psychedelic-pop-art-collection'}>Psychedelic Pop Art</option>
                        <option value={'comic-art-collection'}>Comic Art</option>
                        <option value={'3d-character-collection'}>3d Character</option>
                        <option value={'silhouette-wallpaper-collection'}>Silhouette Wallpaper</option>
                        <option value={'needle-felt-object-collection'}>Needle Felt Object</option>
                        <option value={'flat-design-concept'}>Flat Design</option>
                        <option value={'3d-render-concept'}>3D Render</option>
                        <option value={'paper-cutout-concept'}>Paper Cutout</option>
                        <option value={'modern-3d-animation-concept'}>3D Animation</option>
                        <option value={'anime-concept'}>Anime</option>
                    </select>
                    <Button
                        text={title}
                        type='submit'
                        disabled={isLoading}
                    />
                </div>
            </form>
            <div style={{ padding: '1rem' }}>
                {(progressData && progressPercentage !== 0) ? (
                    <div className='upload-progress__message'>
                        <div>
                            <p>{`Progress: ${progressPercentage}%`}</p>
                        </div>
                        <div className='upload-progress__backdrop'>
                            <div className='upload-progress__tracker' style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                ) : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} >
                {images &&
                    images.map((image, index) => {
                        return (
                            <a
                                key={index}
                                download='PostthreadImage.webp'
                                href={`data:image/.webp;base64,${image}`}>
                                <img style={{ width: '100%' }} src={`data:image/.webp;base64,${image}`} />
                            </a>
                        );
                    })}
            </div>
        </div >
    );

};

export default ImageGenerator;