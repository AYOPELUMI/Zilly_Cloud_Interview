import React from 'react';

interface ImageComponentProps {
  id: string;
  alt: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ id, alt }) => (
    <img className='w-full h-full' src={id} alt={alt} />
);

export default React.memo(ImageComponent);
