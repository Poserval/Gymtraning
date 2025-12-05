package com.example.gymtraining

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.time.LocalDate

@Composable
fun CreateTrainingScreen(
    onBack: () -> Unit,
    onStart: (String) -> Unit
) {
    var trainingName by remember { mutableStateOf("") }
    var exercises by remember { mutableStateOf(listOf<Exercise>()) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                painter = painterResource(id = R.drawable.background2),
                contentScale = ContentScale.Crop
            )
            .padding(16.dp)
    ) {
        // Заголовок
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_back),
                contentDescription = "Назад",
                tint = Color.White,
                modifier = Modifier
                    .size(24.dp)
                    .clickable { onBack() }
            )
            Text(
                text = "Создание тренировки",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.width(24.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Поле ввода названия
        OutlinedTextField(
            value = trainingName,
            onValueChange = { trainingName = it },
            label = { Text("Название тренировки", color = Color.White) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedBorderColor = Color(0xFF1E88E5),
                focusedLabelColor = Color(0xFF1E88E5),
                cursorColor = Color(0xFF1E88E5),
                textColor = Color.White
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Список упражнений
        Text("Упражнения", color = Color.LightGray, fontSize = 16.sp)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
