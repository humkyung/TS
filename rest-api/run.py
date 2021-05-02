from app import app

if __name__ == '__main__':
    app.run(port=8080, debug=False, host='0.0.0.0')
    #app.run(debug=False)