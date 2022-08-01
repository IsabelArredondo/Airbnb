import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, useParams } from 'react-router-dom';
import { updateListing, findASpot } from '../../store/spots'
import './editSpot.css'

const EditSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    
    let { id } = useParams()
    id = Number(id)
    //console.log('THIS IS A PARAM', id)
    const spot = useSelector((state) => (state.spots[id]));
    //console.log('THIS IS A SPOT',spot)

    useEffect(() => {
        dispatch(findASpot(id));
        
      }, [dispatch, id]);

    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    //const [image, setImage] = useState('')
    const [previewImage, setPreviewImage] = useState(spot.previewImage)
    const [price, setPrice] = useState(spot.price)

    const [errors, setErrors] = useState([])
    const [submitted, setSubmitted] = useState(false)

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updatePreviewImage = (e) => setPreviewImage(e.target.value);

    //if (!user) return <Redirect to="/" />;
    if (submitted) return <Redirect to={`/`}/>

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])

        const editedSpot = {
            name: name,
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            previewImage: previewImage,
            description: description,
            price: price
        }

        //history.push(`/spots/${newSpot.id}`)
        //history.push(`/`)
        return dispatch(updateListing(editedSpot, spot.id))

        .then(async (res) => {
            //console.log("success");
            setSubmitted(true);
          })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          });
      };



    return (
        <div className='createSpotPage1'>
        <h2 className='create-title-name' >Need to Update Your Spot?</h2>

        <form onSubmit={handleSubmit} className='createSpotForm1'>
            <ul>
                {errors.map((error, id) => (
                    <li key={id}>{error}</li>
                ))}
            </ul>
            <label className="label">
               <p>Address:</p> 
                <input
                type="text"
                placeholder='Address'
                value={address}
                onChange={updateAddress}
                required
                />
            </label>
            <label className="label">
                <p>City:</p>
                <input
                type="text"
                placeholder='City'
                value={city}
                onChange={updateCity}
                required
                />
            </label>
            <label className="label">
                <p>State:</p>
                <input
                type="text"
                placeholder='State'
                value={state}
                onChange={updateState}
                required
                />
            </label>
            <label className="label">
               <p>Country:</p>
                <input
                type="text"
                placeholder='country'
                value={country}
                onChange={updateCountry}
                required
                />
            </label>
            <label className="label">
                <p>Latitude:</p>
                <input
                type="text"
                placeholder='lat'
                value={lat}
                onChange={updateLat}
                required
                />
            </label>
            <label className="label">
               <p>Longitude:</p> 
                <input
                type="text"
                placeholder='lng'
                value={lng}
                onChange={updateLng}
                required
                />
            </label>
            <label className="label">
              <p>Name:</p>  
                <input
                type="text"
                placeholder='name'
                value={name}
                onChange={updateName}
                required
                />
            </label>
            <label className="label">
                 <p>Description:</p>
                <input
                type="text"
                placeholder='description'
                value={description}
                onChange={updateDescription}
                required
                />
            </label>
            <label className="label">
               <p>Preview Image:</p> 
                <input
                type="text"
                placeholder='Preview Image'
                value={previewImage}
                onChange={updatePreviewImage}
                required
                />
            </label>
            <label className="label">
               <p>Price:</p> 
                <input
                type="text"
                placeholder='Price'
                value={price}
                onChange={updatePrice}
                required
                />
            </label>
            <button className='create' type="submit">Edit Spot</button>
        </form>
        </div >
    )
}

export default EditSpot