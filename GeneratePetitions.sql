-- Генерація 300 користувачів
DECLARE @i INT = 1;
WHILE @i <= 300
BEGIN
    INSERT INTO [dbo].[AspNetUsers]
           ([Id]
           ,[CreatedAt]
           ,[ModifiedAt]
           ,[UserName]
           ,[NormalizedUserName]
           ,[Email]
           ,[NormalizedEmail]
           ,[EmailConfirmed]
           ,[PasswordHash]
           ,[SecurityStamp]
           ,[ConcurrencyStamp]
           ,[PhoneNumber]
           ,[PhoneNumberConfirmed]
           ,[TwoFactorEnabled]
           ,[LockoutEnd]
           ,[LockoutEnabled]
           ,[AccessFailedCount]
           ,[Picture])
    VALUES
           (NEWID()
           ,DATEADD(DAY, -RAND() * 365, GETDATE())
           ,DATEADD(DAY, -RAND() * 365, GETDATE())
           ,CONCAT('user', @i)
           ,CONCAT('USER', @i)
           ,CONCAT('user', @i, '@gmail.com')
           ,CONCAT('USER', @i, '@GMAIL.COM')
           ,0
           ,''
           ,NEWID()
           ,NEWID()
           ,NULL
           ,0
           ,0
           ,NULL
           ,0
           ,0
           ,'');
    SET @i = @i + 1;
END
GO

-- Генерація 10 категорій
DECLARE @j INT = 1;
WHILE @j <= 10
BEGIN
    INSERT INTO [dbo].[CategoryEntity]
           ([Id]
           ,[Name]
           ,[CreatedAt]
           ,[ModifiedAt])
    VALUES
           (NEWID()
           ,CONCAT(N'Категорія ', @j)
           ,DATEADD(DAY, -RAND() * 365, GETDATE())
           ,DATEADD(DAY, -RAND() * 365, GETDATE()));
    SET @j = @j + 1;
END
GO

-- Генерація 400 петицій
DECLARE @k INT = 1;
DECLARE @CategoryCount INT = 10;
DECLARE @UserCount INT = 300;

WHILE @k <= 400
BEGIN
    DECLARE @CreatedAt DATETIME = DATEADD(DAY, -RAND() * 365, GETDATE());

    INSERT INTO [dbo].[PetitionEntity]
           ([Id]
           ,[Title]
           ,[Description]
           ,[RequiredSignatures]
           ,[ExpirationDate]
           ,[CategoryId]
           ,[CreatedByUserId]
           ,[CreatedAt]
           ,[ModifiedAt])
    VALUES
           (NEWID()
           ,CONCAT(N'Заголовок ', @k)
           ,CONCAT(N'Опис до петиції ', @k)
           ,200
           ,DATEADD(DAY, 14, @CreatedAt) -- Дата закінчення через 2 тижні після дати створення
           ,(SELECT TOP 1 [Id] FROM [dbo].[CategoryEntity] ORDER BY NEWID())
           ,(SELECT TOP 1 [Id] FROM [dbo].[AspNetUsers] ORDER BY NEWID())
           ,@CreatedAt
           ,@CreatedAt);
    SET @k = @k + 1;
END
GO

-- Генерація підписів для петицій
DECLARE @l INT = 1;
DECLARE @PetitionId UNIQUEIDENTIFIER;
DECLARE @SignatureCount INT;

-- Генерація підписів для кожної петиції
WHILE @l <= 400
BEGIN
    -- Вибірка петиції, для якої ще немає підписів
    SET @PetitionId = (SELECT TOP 1 [Id] FROM [dbo].[PetitionEntity] 
                       WHERE [Id] NOT IN (SELECT DISTINCT [PetitionId] FROM [dbo].[SignatureEntity])
                       ORDER BY [CreatedAt]);

    -- Перевірка, чи є петиції без підписів
    IF @PetitionId IS NULL
        BREAK;

    SET @SignatureCount = FLOOR(RAND() * 500);

    DECLARE @m INT = 1;
    WHILE @m <= @SignatureCount
    BEGIN
        INSERT INTO [dbo].[SignatureEntity]
               ([Id]
               ,[PetitionId]
               ,[SignedByUserId]
               ,[CreatedAt]
               ,[ModifiedAt])
        VALUES
               (NEWID()
               ,@PetitionId
               ,(SELECT TOP 1 [Id] FROM [dbo].[AspNetUsers] ORDER BY NEWID())
               ,DATEADD(DAY, -RAND() * 365, GETDATE())
               ,DATEADD(DAY, -RAND() * 365, GETDATE()));
        SET @m = @m + 1;
    END

    SET @l = @l + 1;
END
GO
