import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Schedule.css';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment-duration-format';
import { useLanguage } from '../../context/langContext';
import Loading from '../Loading/Loading';

const Schedule = () => {
  const { currentLang } = useLanguage();

  const navigate = useNavigate();
  const { day } = useParams();
  const [upage, setUpage] = useState(1)
  const [currentTime, setCurrentTime] = useState(moment().format('LTS'))
  const [isLoaded, setisLoaded] = useState(false)
  const [filterList, setFilterList] = useState({
    dayName: "",
    schedules: [],
  })
  const [scheduleList, setScheduleList] = useState([
    {
      dayName: "Monday",
      schedules: []
    },
    {
      dayName: "Tuesday",
      schedules: []
    },
    {
      dayName: "Wednesday",
      schedules: []
    },
    {
      dayName: "Thursday",
      schedules: []
    },
    {
      dayName: "Friday",
      schedules: []
    },
    {
      dayName: "Saturday",
      schedules: []
    },
    {
      dayName: "Sunday",
      schedules: []
    }
  ])

  // const todayTime = useRef(moment().format('LTS'))
  function filterDataa(arr, day) {
    const res = arr?.filter((data) => {
      return data.dayName === day;
    });
    return res;
  }

  const fetchSchedule = async (page = 1) => {
    try {
      const { data } = await axios.get(`https://gogo-server.vercel.app/schedule?page=${page}`);
      console.log(data);
      if (data?.schedulesByDay.length > 0) {

        setScheduleList(scheduleList.map((sc) => {
          if (sc.dayName === filterDataa(data.schedulesByDay, sc.dayName)[0]?.dayName) {
            // console.log({scdayName:sc.dayName})
            let schedules = sc.schedules = (filterDataa(data.schedulesByDay, sc.dayName)[0]?.schedules)
            return { ...sc, schedules }
          }
          return sc
        }))
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async(sTitle,sPage=1)=>{
    try {
      // console.log(sTitle)
      const result = await axios.get(`https://gogo-server.vercel.app/search?title=${encodeURIComponent(sTitle)}&page=${sPage}`)
      if(result.data){
        // console.log({result1_Data:"result1_Data"}, result.data);
        navigate(`/anime-details/${result.data.list[0].animeID}`)
        // setAnime(result.data.list);
        // setTotalPage(result.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   console.log({ scheduleList: scheduleList });
  // }, [scheduleList])

  useEffect(() => {
    fetchSchedule()
    const sid = setInterval(() => {
      setCurrentTime(moment().format('LTS'))
    }, 1000);
    return ()=>{
      clearInterval(sid)
    }
  }, [])
  useEffect(() => {
    if (
      scheduleList[0].schedules.length === 0 ||
      scheduleList[1].schedules.length === 0 ||
      scheduleList[2].schedules.length === 0 ||
      scheduleList[3].schedules.length === 0 ||
      scheduleList[4].schedules.length === 0 ||
      scheduleList[5].schedules.length === 0 ||
      scheduleList[6].schedules.length === 0
    ) {
      // console.log("length 0")
      const sapi_call = async () => {

        const { data: nextPage } = await axios.get(`https://gogo-server.vercel.app/schedule?page=${upage + 1}`);
        // console.log("nextPage");
        if (nextPage?.schedulesByDay?.length > 0) {

          setUpage(prev => prev + 1)
          setScheduleList(scheduleList.map((sc) => {
            if (sc.dayName === filterDataa(nextPage.schedulesByDay, sc.dayName)[0]?.dayName) {
              // console.log({scdayName:sc.dayName})
              let schedules = sc.schedules = (filterDataa(nextPage.schedulesByDay, sc.dayName)[0]?.schedules)
              return { ...sc, schedules }
            }
            return sc
          }))
        }

      }
      sapi_call();
    }

    if (
      scheduleList[0].schedules.length !== 0 &&
      scheduleList[1].schedules.length !== 0 &&
      scheduleList[2].schedules.length !== 0 &&
      scheduleList[3].schedules.length !== 0 &&
      scheduleList[4].schedules.length !== 0 &&
      scheduleList[5].schedules.length !== 0 &&
      scheduleList[6].schedules.length !== 0
    ) {

      setisLoaded(true);
      handleNewArray(new Date().toLocaleString('en-us', { weekday: "long" }))
    }
    // console.log({ anime: anime })
  }, [scheduleList])

  function converTime(time) {
    const options = { hour: 'numeric', minute: 'numeric' };

    const ttme = new Date(time * 1000)
    return ttme.toLocaleTimeString([], options)
  }
  function converTimeHour(targetTime) {
    // const targetTime = 1704718800; // Replace this with your Unix timestamp

    const currentTime = moment();
    const targetMoment = moment.unix(targetTime);
    
    let timeString;
    
    if (targetMoment.isBefore(currentTime)) {
      // Event is in the past
      timeString = targetMoment.fromNow();
      return timeString;
    } else {
      // Event is in the future
      const duration = moment.duration(targetMoment.diff(currentTime));
      timeString = duration.format("in d [days] h [hours] m [minutes]", { trim: "both" });
      return timeString;
    }

  }
  
  function handleNewArray(value) {
    const farray = scheduleList.filter((day) => day.dayName === value)
    // console.log(farray)
    setFilterList(farray[0])
    navigate(`/schedule/${value}`)
  }

  // useEffect(() => {
  //   console.log(filterList)
  // }, [filterList])
  
  return (
    <div className='schedule_wrapper'>
      <div className="schedule_currentTime">
        <i className='fa-solid fa-clock'></i><h1>{currentTime}</h1>
      </div>
      <div className="schedule_days">
        {
          scheduleList.map((sch, i) => (
            <button
              key={i}
              className={`${(filterList?.dayName || day) === sch.dayName ? " active" : ""}`}
              onClick={(e) => handleNewArray(sch.dayName)}
            >{sch.dayName}</button>
          ))
        }
      </div>
      {
        !isLoaded ? (
          <Loading LoadingType={"ClockLoader"} color={"red"}/>
        ) : (
          <div className='schedule'>
            {
              filterList?.schedules && filterList?.schedules.map((day, i) => (
                <div className="schedule__card" key={i} onClick={(e)=> fetchData(day.media?.title?.english?(day.media.title.english):(day.media.title.userPreferred))}>
                  <div className="schedule__poster">
                    <img src={day.media?.coverImage?.large} alt="" />
                  </div>
                  <div className="schedule__info">
                    {
                      day.media?.trending >0 &&
                      (<div className="schedule_star">
                      <i className='fa-solid fa-fire'></i>
                      </div>)
                    }
                   
                    <div className="schedule-time">
                      <div className="schedule--main-time">
                      <p>{converTime(day?.airingAt)}</p>
                      </div>
                      <div className="schedule-remain-time">
                      <p>{converTimeHour(day?.airingAt)}</p>
                      </div>
                    </div>
                    <div className="schedule__title">
                      <p>
                        {
                        currentLang === "en" ?(
                        (day.media?.title?.english ? (day.media.title.english) : (day.media.title.userPreferred)))
                        :
                        ((day.media?.title?.romaji ? (day.media.title.romaji) : (day.media.title.userPreferred))
                        )}
                      </p>
                    </div>
                    <div className="schedule__ep">
                      <p>Episode {day?.episode}</p>
                    </div>
                  </div>
                </div>
              ))

            }
          </div>
        )
      }

    </div>
  )
}

export default Schedule
