import { useState, useCallback } from 'react';

import './cropper.styles.scss';
import Cropper from 'react-easy-crop';

const CropperComponent = ({src}) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [verticalOrientation, setVerticalOrientation] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, [])

    const image = new Image()
    image.src = src
    image.onload = () => {
        if (image.height > image.width) {
            setVerticalOrientation(true)
        } else {
            setVerticalOrientation(false)
        }
    }     

    return (
        <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1/1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={
                {
                    containerClassName: 'cropper-container',
                    cropAreaClassName: 'crop-area'
                }
            }
            objectFit={verticalOrientation ? 'horizontal-cover' : 'vertical-cover'}
            restrictPosition={true}
        />
    )
}

export default CropperComponent;