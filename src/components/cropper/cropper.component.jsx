import { useState, useCallback, useRef } from 'react';
import getCroppedImg from './cropImage';
import { connect } from 'react-redux';
import { getCropImage } from '../../redux/cropImage/cropImage.actions';
import { setCropper } from '../../redux/cropImage/cropImage.actions';
import { ReactComponent as SettingsBtn } from '../../assets/media/settings.svg';

import './cropper.styles.scss';
import Cropper from 'react-easy-crop';
import gsap from 'gsap';

const CropperComponent = ({ src, getCropImage, setCropper }) => {

    const cropperSettingsRef = useRef()
    const toggleSettings= useRef(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(1/1)
    const [aspectSelected, setAspectSelected] = useState('11')
    const [verticalOrientation, setVerticalOrientation] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                src,
                croppedAreaPixels,
            )
            console.log('donee', croppedImage)
            getCropImage(croppedImage)
            setCropper(false)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels])

    const cancelCropImage = () => {
        setCropper(false)
    }

    const image = new Image()
    image.src = src
    image.onload = () => {
        if (image.height > image.width) {
            setVerticalOrientation(true)
        } else {
            setVerticalOrientation(false)
        }
    }

    const helperToggleCropSettings = () => {
        if (!toggleSettings.current) {
            gsap.to(cropperSettingsRef.current, {duration: 0, opacity: 1, pointerEvents: 'auto'})
            toggleSettings.current = true
        } else if (toggleSettings.current) {
            gsap.to(cropperSettingsRef.current, {duration: 0, opacity: 0, pointerEvents: 'none'})
            toggleSettings.current = false
        }
    }

    const toggleCropSettings = () => {
        helperToggleCropSettings()
    }

    const setAspect11 = () => {
        setAspect(1/1)
        setAspectSelected('11')
        helperToggleCropSettings()
    }

    const setAspect45 = () => {
        setAspect(4/5)
        setAspectSelected('45')
        helperToggleCropSettings()
    }

    const setAspect169 = () => {
        setAspect(16/9)
        setAspectSelected('169')
        helperToggleCropSettings()
    }

    return (
        <>
            <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
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
            <div className='cropper-toolbar'>
                <p className='cropper-tool' onClick={() => {cancelCropImage()}}>Cancel</p>
                <p className='cropper-tool' onClick={() => {showCroppedImage()}}>Done</p>
            </div>

            <SettingsBtn className='settings-btn' onClick={() => {toggleCropSettings()}}/>
            <div className='cropper-settings' ref={cropperSettingsRef}>
                <p className={`${aspectSelected === '11' && 'aspect-selected'} aspect`} onClick={() => {setAspect11()}}>1 : 1</p>
                <p className={`${aspectSelected === '45' && 'aspect-selected'} aspect`} onClick={() => {setAspect45()}}>4 : 5</p>
                <p className={`${aspectSelected === '169' && 'aspect-selected'} aspect`} onClick={() => {setAspect169()}}>16 : 19</p>
            </div>
        </>
    )
}

const mapDispatchToProps = (dispatch) => ({
    getCropImage: (cropImage) => (dispatch(getCropImage(cropImage))),
    setCropper: (boolean) => (dispatch(setCropper(boolean)))
})

export default connect(null, mapDispatchToProps)(CropperComponent);