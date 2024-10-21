class GlobalData:
    game_id_counter = 0
    user_id = 0

    @classmethod
    def increment_game_id_counter(cls):
        cls.game_id_counter += 1
        return cls.game_id_counter

    @classmethod
    def increment_user_id_counter(cls):
        cls.user_id += 1
        return cls.user_id


# current_game_id = GlobalData.increment_game_id_counter()
