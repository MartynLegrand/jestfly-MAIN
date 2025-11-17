interface HeroVideoProps {
  videoUrl: string;
  autoplay?: boolean;
  loop?: boolean;
}

const HeroVideo = ({ videoUrl, autoplay = true, loop = true }: HeroVideoProps) => {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay={autoplay}
      loop={loop}
      muted
      playsInline
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default HeroVideo;
