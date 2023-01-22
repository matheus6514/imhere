import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import dayjs from "dayjs";

import { HabitDay, DAY_SIZE } from "../componentes/HabitDay";
import { Header } from "../componentes/Header";
import { Loading } from "../componentes/Loading";

import { api } from '../lib/axios';
import { generateRangeDatesFromYearStart} from '../utils/generate-range-between-dates'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length

type SymmaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home() {
    const [ loading, setLoaging] = useState(true);
    const [ summary, setSummary] = useState<SymmaryProps | null>(null);
    const { navigate } = useNavigation();

    async function fetchData(){
        try{
            setLoaging(true);
            const response = await api.get('/summary');
            setSummary(response.data);
        }catch (error) {
            Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.');
            console.log(error);
        }finally {
            setLoaging(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData();
    },[]));

    if(loading){
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekday, i) => (
                        <Text
                            key={`${weekday}+${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }}
                        >
                            {weekday}
                        </Text>
                    )) 
                }
            </View>
            
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100}}
            >
                {
                    summary &&
                    <View className="flex-row flew-wrap">
                        {
                            datesFromYearStart.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })

                                return(
                                    <HabitDay
                                        key={date.toString()}
                                        date={date}
                                        amountOfHabits={dayWithHabits?.amount}
                                        amountCompleted={dayWithHabits?.completed}
                                        onPress={() => navigate('habit', {date: date.toISOString() })}
                                    />
                                )
                            })
                        }

                        {
                            amountOfDaysToFill > 0 && Array
                            .from({ length: amountOfDaysToFill})
                            .map((_, index) => (
                                <View
                                    key={index}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{width: DAY_SIZE, height: DAY_SIZE}}
                                />
                            ))
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}