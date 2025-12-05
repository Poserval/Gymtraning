package com.example.gymtraining

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.YearMonth
import java.time.temporal.WeekFields

@Composable
fun MainScreen(
    onNewTrainingClick: () -> Unit = {}
) {
    val current = LocalDate.now()
    val currentDay = current.dayOfMonth
    val currentMonth = current.month
    val currentYear = current.year

    val yearMonth = YearMonth.now()
    val daysInMonth = yearMonth.lengthOfMonth()

    val firstDayOfMonth = current.withDayOfMonth(1)
    val firstDayOfWeek = firstDayOfMonth.dayOfWeek
    val weekFields = WeekFields.of(DayOfWeek.MONDAY, 1)
    val firstDayWeekIndex = firstDayOfWeek.ordinal - DayOfWeek.MONDAY.ordinal

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                painter = painterResource(id = R.drawable.background2),
                contentScale = ContentScale.Crop
            )
            .padding(16.dp)
    ) {
        Column {
            Text(
                text = "${currentMonth.name.lowercase().replaceFirstChar { it.uppercase() }} $currentYear",
                color = Color.White,
                fontSize = 22.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            // Дни недели
            Row {
                listOf("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс").forEach { day ->
                    Text(
                        text = day,
                        modifier = Modifier
                            .weight(1f)
                            .padding(4.dp),
                        textAlign = TextAlign.Center,
                        color = Color.LightGray,
                        fontSize = 14.sp
                    )
                }
            }

            // Сетка календаря
            val days = List(firstDayWeekIndex) { null } + (1..daysInMonth).toList()
            val weeks = days.chunked(7)

            weeks.forEach { week ->
                Row {
                    week.forEach { day ->
                        if (day != null) {
                            val isToday = day == currentDay
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .aspectRatio(1f)
                                    .clip(CircleShape)
                                    .background(if (isToday) Color(0xFF1E88E5) else Color.Transparent)
                                    .clickable { /* Позже: выбор даты */ }
                                    .padding(2.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = day.toString(),
                                    color = Color.White,
                                    fontSize = 14.sp,
                                    fontWeight = if (isToday) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        } else {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }

            // Кнопка "Новая тренировка"
            Button(
                onClick = onNewTrainingClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 20.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1E88E5)
                )
            ) {
                Text("➕ Новая тренировка", color = Color.White)
            }
        }
    }
}
