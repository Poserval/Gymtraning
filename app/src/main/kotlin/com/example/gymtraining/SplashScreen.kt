package com.example.gymtraining

import android.graphics.drawable.shapes.Shape
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import java.time.LocalDate
import java.time.YearMonth

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    var splashFinished by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(3000)
        if (!splashFinished) {
            splashFinished = true
            onSplashFinished()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                painter = painterResource(id = R.drawable.background1),
                contentScale = ContentScale.Crop
            )
            .clickable {
                if (!splashFinished) {
                    splashFinished = true
                    onSplashFinished()
                }
            },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Gym Training",
            color = Color.White,
            fontSize = 28.sp,
            textAlign = TextAlign.Center
        )
    }
}
