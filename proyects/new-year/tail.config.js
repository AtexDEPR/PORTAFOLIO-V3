tailwind.config = {
    theme: {
        extend: {
            backgroundImage: {
                'january': 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
                'february': 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)',
                'march': 'linear-gradient(135deg, #2ecc71, #3498db, #9b59b6)',
                'april': 'linear-gradient(135deg, #f1c40f, #e67e22, #d35400)',
                'may': 'linear-gradient(135deg, #3498db, #2980b9, #34495e)',
                'june': 'linear-gradient(135deg, #e74c3c, #c0392b, #e67e22)',
                'july': 'linear-gradient(135deg, #2c3e50, #34495e, #2ecc71)',
                'august': 'linear-gradient(135deg, #f39c12, #d35400, #e74c3c)',
                'september': 'linear-gradient(135deg, #8e44ad, #9b59b6, #3498db)',
                'october': 'linear-gradient(135deg, #e67e22, #d35400, #c0392b)',
                'november': 'linear-gradient(135deg, #2980b9, #3498db, #2ecc71)',
                'december': 'linear-gradient(135deg, #8e1f26, #7d0e17, #2a6f3a, #1f5a2a)'



            },
            animation: {
                'star-pulse': 'starPulse 2s infinite alternate',
                'float': 'float 3s infinite ease-in-out',
                'spin-slow': 'spin 10s linear infinite'
            },
            keyframes: {
                starPulse: {
                    '0%': { opacity: '0.2', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' }
                }
            }
        }
    }
}